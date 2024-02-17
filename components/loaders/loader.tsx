import React from 'react'

const Loader = () => {
  return (
    <div className="flex flex-row gap-1">
      <div className="w-1.5 h-1.5 rounded-full bg-foreground animate-bounce"></div>
      <div className="w-1.5 h-1.5 rounded-full bg-foreground animate-bounce [animation-delay:-.1s]"></div>
      <div className="w-1.5 h-1.5 rounded-full bg-foreground animate-bounce [animation-delay:-.3s]"></div>
    </div>
  );
};

export default Loader;