import { Loader, Top } from "@toss/tds-mobile";

export function AuthLoadingScreen() {
  return (
    <>
      <Top
        title={<Top.TitleParagraph size={22}>월지출계산기</Top.TitleParagraph>}
        subtitleBottom={
          <Top.SubtitleParagraph size={17}>
            앱을 준비하고 있어요
          </Top.SubtitleParagraph>
        }
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: 80,
        }}
      >
        <Loader size="large" />
      </div>
    </>
  );
}
