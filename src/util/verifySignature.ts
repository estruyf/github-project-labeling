import * as crypto from "crypto";
import { HttpRequest } from "@azure/functions";
import { ProjectChange } from "../models";

const WEBHOOK_SECRET: string = process.env.WEBHOOK_SECRET;

export const verifySignature = (req: HttpRequest, body: ProjectChange) => {
  const signature = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(JSON.stringify(body))
    .digest("hex");

  let trusted = Buffer.from(`sha256=${signature}`, "ascii");
  let untrusted = Buffer.from(req.headers.get("x-hub-signature-256"), "ascii");
  return crypto.timingSafeEqual(trusted, untrusted);
};
