import { useState } from "react";
import { useAuth } from "../../context/authContext";
import ItemModal from "./ItemModal";
import Separator from "../Separator";

export default function Items({ items, type }) {
  if (type === "OnlyItems") {
    return (
      <div className="flex gap-2 border-4 p-6 max-w-[500px] flex-wrap capitalize item font-bold">
        {items
          ? items.map((item, index) => (
              <>
                {item.type === "separator" ? null : (
                  <>
                    <div key={item.id}>{item.name}</div>
                    {index !== items.length - 1 && <span>|</span>}{" "}
                  </>
                )}
              </>
            ))
          : ""}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-y-2 border-4 p-6 max-w-[500px]">
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
          className="flex capitalize item items-center"
        >
          <p className="text-start">{item.name}</p>
          <p className="text-[0.3rem] ml-2">{item.description}</p>
        </button>
        <p>{item.price}</p>
        <ItemModal
          isOpen={modalOpen}
          item={item}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-[1fr_28%] items-center">
      <div className="flex capitalize item items-center">
        <p className="">{item.name}</p>
        <p className="text-[0.3rem] ml-2">{item.description}</p>
      </div>
      <p className="">{item.price}</p>
    </div>
  );
}
