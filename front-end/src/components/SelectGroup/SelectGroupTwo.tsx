import { useEffect, useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa6";

interface Option {
  id?: string;
  name?: string;
}

interface CustomSelect2Props {
  option: Option[];
  errors: any;
  touched: any;
  values: string;
  name: string;
  setformik: (name: string, value: string) => void;
}

const CustomSelect2: React.FC<CustomSelect2Props> = ({ option, errors, touched, values, name, setformik }) => {
  const [isOpen, setIsOpen] = useState(false);
  const refOne = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    document.addEventListener('click', clickOutSide, true);
    return () => {
      document.removeEventListener('click', clickOutSide, true);
    };
  }, []);

  const clickOutSide = (e: MouseEvent) => {
    if (refOne.current && !refOne.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  let result : any= option?.find((opt) => opt.id === values);

  return (
    <div className={`${errors && touched ? "red" : ""} ${!values ? "placeholder" : ""} dropdown`} ref={refOne}>
       <label className="mb-3 block text-sm font-medium text-black dark:text-white">Apply To </label>
      <div className={isOpen ? "active dropdown-btn" : "dropdown-btn"} onClick={() => {
        toggleDropdown();
      }}>
        {values && result && result.name ? result.name : "select your answer"}
        <FaAngleDown />
      </div>
      {isOpen && (
        <div className="dropdown-content">
          {option.map((item :any, index) => (
            <div key={index} onClick={() => {
              if(name == "requestToId"){
                setformik(name, item.id);
              } else {
                setformik(name, item.name);
              }
              setIsOpen(false);
            }} className="dropdown-item">
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect2;
