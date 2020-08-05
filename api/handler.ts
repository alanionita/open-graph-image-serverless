import { Handler, Context } from "aws-lambda";
// import { parseRequest } from "./_lib/parser";
import { getScreenshot } from "./_lib/chromium";
import { getHtml } from "./_lib/template";
import { ParsedRequest } from "_lib/types";

// TODO: refactor to use AWS Lambda / AWS API Gateway events

const isDev = !process.env.AWS_REGION;
const isHtmlDebug = process.env.OG_HTML_DEBUG === "1";

export const api: Handler = async (event: any, context: Context) => {
  console.log('event :: ', event)
  console.log('ctx :: ', context)
  try {
    const parsedReq: ParsedRequest = {
      text: "test",
      theme: "light",
      md: true,
      fontSize: "100px",
      images: [
        "https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fvercel-triangle-black.svg",
      ],
      fileType: "jpeg",
      widths: ["200px"],
      heights: ["200px"],
    };
    const html = getHtml(parsedReq);
    if (isHtmlDebug) {
      // res.setHeader("Content-Type", "text/html");
      // res.end(html);
      return html;
    }
    const { fileType } = parsedReq;
    const file = await getScreenshot(html, fileType, isDev);
    // res.statusCode = 200;
    // res.setHeader("Content-Type", `image/${fileType}`);
    // res.setHeader(
    //   "Cache-Control",
    //   `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
    // );
    // res.end(file);
    return file;
  } catch (e) {
    // res.statusCode = 500;
    // res.setHeader("Content-Type", "text/html");
    // res.end("<h1>Internal Error</h1><p>Sorry, there was a problem</p>");
    console.warn("Error :: ", e.message, e.stack);
    return new Error(e.message);
  }
};
