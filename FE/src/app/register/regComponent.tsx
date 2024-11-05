"use client";

import React, { useState } from "react";

type RegComponentProps = {
  onRegister: (password: string) => Promise<any>;
};

const RegComponent: React.FC<RegComponentProps> = ({ onRegister }) => {
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // 서버 액션 호출
    try {
      const result = await onRegister(password);
      console.log("server response:", result);
    } catch (error) {
      console.error("failed to register:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="submit">Register</button>
    </form>
  );
};

export default RegComponent;
