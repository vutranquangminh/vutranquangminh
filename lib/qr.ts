import "server-only";
import QRCode from "qrcode";

/** Crisp QR as inline SVG (scales to any size, no image request). */
export async function qrSvg(payload: string, margin = 2): Promise<string> {
  return QRCode.toString(payload, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin,
    color: { dark: "#000000", light: "#ffffff" },
  });
}

/**
 * QR as PNG with whole-pixel modules and a full 4-module quiet zone.
 * Used by the iPhone widget, which draws it 1:1 at 3x so nothing is resampled.
 */
export async function qrPng(payload: string, modulePx: number): Promise<Buffer> {
  return QRCode.toBuffer(payload, { type: "png", errorCorrectionLevel: "M", margin: 4, scale: modulePx });
}
