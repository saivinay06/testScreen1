import React from "react";

function Stepper({ active, arr }) {
  return (
    <div className="flex items-center justify-center gap-3">
      {arr.map((_, i) => (
        <>
          <div
            key={i}
            className={`flex items-center gap-3 rounded-[50%] border-[3px] ${
              active === i + 1
                ? "border-[#DAFD24] text-black text-sm shadow-[0_40px_70px_-1px_rgba(218,253,36,0.6)]"
                : "border-[#464646] text-[#464646]"
            }`}
          >
            <p
              className={`m-1 ${
                active === i + 1 ? "bg-[#DAFD24]" : ""
              }  py-[5px] px-3 rounded-[50%]`}
            >
              {i + 1}
            </p>
          </div>
          {i < arr.length - 1 && (
            <div className="w-[50%]">
              <div className="w-full border-[1.5px] border-[#464646]"></div>
            </div>
          )}
        </>
      ))}
    </div>
  );
}

export default Stepper;
