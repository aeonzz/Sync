"use client";

import { gsap } from "gsap"
import { useGSAP } from "@gsap/react";

// gsap.registerPlugin(useGSAP);

const Haha = () => {

  // useGSAP(() => {
  //   gsap.to("#tangina", {
  //     ease: "power4.inOut",
  //     height: 300,
  //     duration: 1,
  //     repeat: -1,
  //   })
  // }, [])

  return (
    <div className="flex items-center justify-center">
      {/* <div id="tangina" className="w-32 h-32 rounded-lg bg-blue-400"></div> */}
    </div>
  );
};

export default Haha;
