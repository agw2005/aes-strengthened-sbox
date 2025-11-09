import CustomNav from "./CustomNav.tsx";

interface HeaderProps {
  children: string;
}

const Header = ({ children }: HeaderProps) => {
  return (
    <>
      <h1 className="font-extrabold text-sm md:text-3xl text-center text-white">
        {children}
      </h1>
      <CustomNav />
    </>
  );
};

export default Header;
