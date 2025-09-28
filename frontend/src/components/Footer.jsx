function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-10">
      <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-600">&copy; {new Date().getFullYear()} Hela Bazar. All rights reserved.</p>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-blue-600">Privacy</a>
          <a href="#" className="hover:text-blue-600">Terms</a>
          <a href="#" className="hover:text-blue-600">Contact</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
