"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useMainContext } from "@/hooks/useMainContext";

const MainLayout = ({ children }) => {
  const { theme, loading } = useMainContext();

  return loading ? (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/80 text-sm">Loading...</p>
      </div>
    </div>
  ) : (
    <>
      <Header />

      <main className={`${theme} bg-background min-h-[70vh] md:min-h-screen`}>
        {children}
      </main>

      <Footer />
    </>
  );
};
export default MainLayout;
