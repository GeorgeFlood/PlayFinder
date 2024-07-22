import React from "react";
import "ldrs/ring";
import { leapfrog } from "ldrs";
leapfrog.register(); // Default values shown
const Loader = () => {
  return (
    <div>
      <l-leapfrog size="40" speed="2.5" color="black"></l-leapfrog>
    </div>
  );
};

export default Loader;
