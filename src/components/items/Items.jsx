import { useState } from "react";
import { useAuth } from "../../context/authContext";
import ItemModal from "./ItemModal";
import Separator from "../Separator";

export default function Items({ items, type }) {
  if (type === "OnlyItems") {
    return (
      <div className="flex gap-2 border-4 border-white p-6 flex-wrap capitalize item font-bold">
        {items
          ? items.map((item, index) => (
              <span key={index} className="flex gap-2 text-[0.8rem] text-start">
                {item.type === "separator" ? null : (
                  <>
                    <div>{item.name}</div>
                    {index !== items.length - 1 && <span>|</span>}{" "}
                  </>
                )}
              </span>
            ))
          : ""}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-y-2 border-4 border-white p-6 ">
      {items ? items.map((item) => <Item key={item.id} item={item} />) : ""}
    </div>
  );
}

function Item({ item }) {
  const { authenticated } = useAuth();
  const [modalOpen, setIsModalOpen] = useState(false);
  if (item.type === "separator") {
    if (authenticated && window.location.pathname === "/dashboard") {
     return (
       <button
         onClick={() => setIsModalOpen(true)}
         className="flex justify-center cursor-pointer"
       >
         <Separator />
         <ItemModal
           isOpen={modalOpen}
           item={item}
           onClose={() => setIsModalOpen(false)}
         />
       </button>
     );
    }
    return (
      <div className="flex justify-center">
        <Separator />
      </div>
    );
  }

  if (authenticated && window.location.pathname === "/dashboard") {
    return (
      <div className="grid grid-cols-[1fr_28%]">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex capitalize item"
        >
          <p className="text-[0.8rem] text-start">{item.name}</p>
          <p className="text-[0.3rem] ml-2 text-start mr-4">{item.description}</p>
        </button>
        <p className="text-[0.8rem]">{item.price}</p>
        <ItemModal
          isOpen={modalOpen}
          item={item}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-[1fr_28%]">
      <div className="flex capitalize item">
        <p className="text-[0.8rem] text-start">{item.name}</p>
        <p className="text-[0.3rem] ml-2 text-start mr-4">{item.description}</p>
      </div>
      <p className="text-[0.8rem]">{item.price}</p>
    </div>
  );
}
