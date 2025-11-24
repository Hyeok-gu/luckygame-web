import localFont from "next/font/local";
import "./globals.css";

const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920", //허용 weight 45 ~ 920
  variable: "--font-pretendard", //css에서 선언할 때 사용.
});

export const metadata = {
  title: "운빨존많겜 신화영웅 테스트",
  description: "운빨존많겜 신화영웅 테스트",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <meta
        name="description"
        content="운빨존많겜 신화영웅을 테스트하세요."
      ></meta>
      <body className={pretendard.className}>{children}</body>
    </html>
  );
}
