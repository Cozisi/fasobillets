import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: false, // On l'active même en local pour tester
  workboxOptions: {
    disableDevLogs: true,
  },
});

export default withPWA({
  // Tes autres options de configuration si tu en as
});