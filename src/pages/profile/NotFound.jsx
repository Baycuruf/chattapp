import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="text-center grid gap-y-6 pt-5">
      <h2 className="text-[22px] font-semibold">Üzgünüz, bu sayfaya ulaşılamıyor.</h2>
      <p>
        Tıkladığın bağlantı bozuk olabilir veya sayfa kaldırılmış olabilir. {""}
       <Link className="text-link" to="/">Chatapp'a geri dön</Link> 
      </p>
    </div>
  );
}

export default NotFound;
