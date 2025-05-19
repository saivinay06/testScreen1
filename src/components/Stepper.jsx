import React from "react";

function Stepper({ active, arr }) {
  return (
    <div className="flex items-center gap-3">
      {arr.map((_, i) => (
        <>
          <div
            key={i}
            className={`flex items-center gap-3 border border-gray-200 py-2 px-4 rounded-[50%] ${
              active === i + 1 ? "bg-black text-white" : ""
            }`}
          >
            <p className="">{i + 1}</p>
          </div>
          {i < arr.length - 1 && (
            <div className="w-full">
              <div className="w-full border border-gray-200"></div>
            </div>
          )}
        </>
      ))}
    </div>
  );
}

export default Stepper;
