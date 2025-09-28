import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-6">
        <Outlet /> {/* Page content here */}
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
