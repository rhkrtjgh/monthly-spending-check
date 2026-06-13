import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "spendingcheck", // 콘솔에 입력한 appName을 입력하세요.
  brand: {
    displayName: "월지출계산기", // 콘솔에 입력한 앱 이름을 입력하세요.
    primaryColor: "#3182F6", // 토스 블루
    icon: "https://static.toss.im/appsintoss/40867/265be396-92a0-429b-b80b-431592575d88.png", // 콘솔에서 업로드한 이미지의 URL을 입력하세요.(콘솔의 앱 정보에서 업로드한 이미지를 우클릭해 링크 복사 후 넣어주세요)
  },
  web: {
    // iOS 실기기 테스트: Mac과 iPhone이 같은 Wi-Fi에 있어야 해요.
    // IP가 바뀌면 `ipconfig getifaddr en0`로 다시 확인하세요.
    host: "172.30.1.97",
    port: 5173,
    commands: {
      dev: "vite dev --host",
      build: "vite build",
    },
  },
  permissions: [],
  outdir: "dist",
  webViewProps: {
    type: "partner",
  },
});
