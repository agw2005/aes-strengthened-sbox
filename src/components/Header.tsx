import CustomNav from "./CustomNav.tsx";

interface HeaderProps {
  children: string;
}

const Header = ({ children }: HeaderProps) => {
  return (
    <>
      <h1 className="text-pastel-primary dark:text-dark-primary filter drop-shadow font-extrabold text-[1.7rem] md:text-3xl text-center">
        {children}
      </h1>
      <CustomNav />
    </>
  );
};

export default Header;
