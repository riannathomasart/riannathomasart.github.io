// Stamps a faint "© Rianna Thomas" across the bottom-right corner of the
// artwork in an image: partly on the art, partly on the paper around it, so it
// can't be cropped off along with the border.
//
//   swift tools/watermark.swift clean.jpg images/name.jpg
//
// If swift says "this SDK is not supported by the compiler", the Command
// Line Tools are mid-update. Point it at an older SDK from
// /Library/Developer/CommandLineTools/SDKs, for example:
//
//   swift -sdk /Library/Developer/CommandLineTools/SDKs/MacOSX26.5.sdk \
//     tools/watermark.swift clean.jpg images/name.jpg
//
// Run it on both copies of an artwork, name.jpg and name-800.jpg, so the
// mark shows whichever one the browser picks. Always start from a clean
// copy, never from an already-marked file, or the marks stack.
//
// Dark text with a soft white halo, so it reads on light paper and on dark
// paintings alike. Where the art runs to the edge of the image, the mark sits
// in the image's own bottom-right corner, wholly on the art.

import AppKit
import Foundation
import ImageIO
import UniformTypeIdentifiers

let args = CommandLine.arguments
guard args.count == 3 else {
  FileHandle.standardError.write("usage: swift watermark.swift <clean.jpg> <out.jpg>\n".data(using: .utf8)!)
  exit(1)
}

let inURL = URL(fileURLWithPath: args[1])
let outURL = URL(fileURLWithPath: args[2])

guard let source = CGImageSourceCreateWithURL(inURL as CFURL, nil),
      let image = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
  FileHandle.standardError.write("could not read \(args[1])\n".data(using: .utf8)!)
  exit(1)
}

let width = image.width, height = image.height
let ctx = CGContext(data: nil, width: width, height: height, bitsPerComponent: 8, bytesPerRow: 0,
                    space: CGColorSpace(name: CGColorSpace.sRGB)!,
                    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx.draw(image, in: CGRect(x: 0, y: 0, width: width, height: height))

// Sized off the short side, so landscape and portrait pieces get the same mark.
let shortSide = CGFloat(min(width, height))
let fontSize = max(14, shortSide * 0.026)
let margin = shortSide * 0.03

let halo = NSShadow()
halo.shadowColor = NSColor(white: 1, alpha: 0.7)
halo.shadowBlurRadius = fontSize * 0.3
halo.shadowOffset = .zero

let mark = NSAttributedString(string: "© Rianna Thomas", attributes: [
  .font: NSFont(name: "Georgia", size: fontSize) ?? NSFont.systemFont(ofSize: fontSize),
  .foregroundColor: NSColor(white: 0, alpha: 0.45),
  .shadow: halo,
])

// Mark which pixels carry "ink": anything dark, or clearly coloured, as
// opposed to white or cream paper. Separately, mark the very dark pixels,
// where dark text would get lost. Running totals (integral images) then give
// either count inside any rectangle in constant time.
let pixels = ctx.data!.bindMemory(to: UInt8.self, capacity: ctx.bytesPerRow * height)
var inkSum = [Int32](repeating: 0, count: (width + 1) * (height + 1))   // row 0 is the top
var darkSum = inkSum
for y in 0..<height {
  let row = pixels + y * ctx.bytesPerRow
  var inkRun: Int32 = 0, darkRun: Int32 = 0
  for x in 0..<width {
    let r = Int(row[x * 4]), g = Int(row[x * 4 + 1]), b = Int(row[x * 4 + 2])
    let lightness = (r * 299 + g * 587 + b * 114) / 1000
    let colourfulness = max(r, g, b) - min(r, g, b)
    if lightness < 200 || colourfulness > 60 { inkRun += 1 }
    if lightness < 90 { darkRun += 1 }
    let i = (y + 1) * (width + 1) + x + 1, above = y * (width + 1) + x + 1
    inkSum[i] = inkSum[above] + inkRun
    darkSum[i] = darkSum[above] + darkRun
  }
}
func fraction(_ sum: [Int32], _ x: Int, _ top: Int, _ w: Int, _ h: Int) -> Double {
  let a = sum[top * (width + 1) + x], b = sum[top * (width + 1) + x + w]
  let c = sum[(top + h) * (width + 1) + x], d = sum[(top + h) * (width + 1) + x + w]
  return Double(d - b - c + a) / Double(w * h)
}

// Search the lower-right of the image for the spot where the mark straddles
// the edge of the art, about half on it and half off, steering clear of very
// dark patches and favouring spots nearer the corner. Where the art fills the
// image, no spot is half and half, and the corner wins: the mark sits wholly
// on the art.
let size = mark.size()
let markW = Int(size.width.rounded(.up)), markH = Int(size.height.rounded(.up))
let m = Int(margin), step = max(4, Int(fontSize / 3))
let xs = stride(from: width - markW - m, through: max(m, Int(Double(width) * 0.3)), by: -step)
let tops = stride(from: height - markH - m, through: max(m, Int(Double(height) * 0.45)), by: -step)
var best = (x: width - markW - m, top: height - markH - m, score: Double.infinity)
for x in xs {
  for top in tops {
    let offCorner = Double(width - m - markW - x) / Double(width) + Double(height - m - markH - top) / Double(height)
    let score = abs(fraction(inkSum, x, top, markW, markH) - 0.5)
      + 0.8 * fraction(darkSum, x, top, markW, markH)
      + 0.35 * offCorner
    if score < best.score { best = (x, top, score) }
  }
}
let origin = CGPoint(x: CGFloat(best.x), y: CGFloat(height - best.top - markH))   // CG counts up from the bottom

NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = NSGraphicsContext(cgContext: ctx, flipped: false)
mark.draw(at: origin)
NSGraphicsContext.restoreGraphicsState()

guard let marked = ctx.makeImage(),
      let dest = CGImageDestinationCreateWithURL(outURL as CFURL, UTType.jpeg.identifier as CFString, 1, nil) else {
  FileHandle.standardError.write("could not write \(args[2])\n".data(using: .utf8)!)
  exit(1)
}
CGImageDestinationAddImage(dest, marked, [kCGImageDestinationLossyCompressionQuality: 0.8] as CFDictionary)
exit(CGImageDestinationFinalize(dest) ? 0 : 1)
