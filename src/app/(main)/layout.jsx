import Footer from "@/components/Footer";
import Header from "@/components/Header";

const layout = ({ children }) => {
  return (
    <>
      <Header />

      <main>{children}</main>

      <Footer />
    </>
  );
};
export default layout;
