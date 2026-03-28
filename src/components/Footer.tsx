const Footer = () => {
  return (
    <footer className="border-t border-border px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-bold gradient-text">Keystone</span>
          <span className="font-bold text-foreground"> Growth Hub</span>
          <p className="text-xs text-muted-foreground mt-1">
            Founded by Shahan-E-Ali · Diagnosis → Strategy → Execution
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Keystone Growth Hub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
