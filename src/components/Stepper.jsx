import React from "react";

function Stepper({ active, arr }) {
  return (
    <div className="flex items-center justify-center gap-3">
      {arr.map((_, i) => (
        <React.Fragment key={i}>
          <div
            className={`flex items-center justify-center h-[44px] w-[44px] rounded-full border-[3px] ${
              active === i + 1
                ? "border-[#DAFD24] text-black text-sm shadow-[0_40px_70px_-1px_rgba(218,253,36,0.6)]"
                : "border-[#464646] text-[#464646]"
            }`}
          >
            <div
              className={`flex items-center justify-center ${
                active === i + 1 ? "bg-[#DAFD24]" : ""
              } h-[33px] w-[32.5px] rounded-[50%] text-sm font-medium`}
            >
              {i + 1}
            </div>
          </div>
          {i < arr.length - 1 && (
            <div className="w-[50%]">
              <div className="w-full border-[1.5px] border-[#464646]"></div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default Stepper;
