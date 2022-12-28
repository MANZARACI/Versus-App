import React, { useRef, useState } from "react";

const NewVersusForm = (props) => {
  const [name_0Error, setName_0Error] = useState("");
  const [name_1Error, setName_1Error] = useState("");

  const [image_0, setImage_0] = useState();
  const [image_1, setImage_1] = useState();

  const name_0Ref = useRef();
  const name_1Ref = useRef();

  const submitHandler = (event) => {
    event.preventDefault();

    const name_0 = name_0Ref.current.value.trim();
    const name_1 = name_1Ref.current.value.trim();

    let hasError = false;

    //validation
    if (name_0.length === 0 || name_0.length > 20) {
      setName_0Error("Name length must be between 1 and 20 (inclusive)!");
      hasError = true;
    } else {
      setName_0Error("");
    }

    if (name_1.length === 0 || name_1.length > 20) {
      setName_1Error("Name length must be between 1 and 20 (inclusive)!");
      hasError = true;
    } else {
      setName_1Error("");
    }

    if (!hasError) {
      const formData = new FormData();
      formData.append("image_0", image_0);
      formData.append("name_0", name_0);
      formData.append("image_1", image_1);
      formData.append("name_1", name_1);
      props.onSaveVersus(formData);
    }
  };

  return (
    <form onSubmit={submitHandler} className="flex flex-col">
      <label className="form-label">First Item's Image</label>
      <input
        className="file:rounded-full file:py-2 file:px-5 mt-2 file:text-white file:bg-gradient-to-r file:from-orange-400 file:to-orange-700 hover:file:cursor-pointer hover:file:opacity-80"
        type="file"
        id="image_0"
        name="image_0"
        accept="image/*"
        onChange={({ target }) => {
          if (target.files) {
            setImage_0(target.files[0]);
          }
        }}
      />

      <label className="form-label mt-5">First Item's Name</label>
      <input
        ref={name_0Ref}
        className="form-input"
        id="name_0"
        name="name_0"
        type="text"
        minLength={0}
        maxLength={20}
      />
      {name_0Error && <p className="text-red-600">{name_0Error}</p>}

      <label className="form-label mt-5">Second Item's Image</label>
      <input
        className="file:rounded-full file:py-2 file:px-5 mt-2 file:text-white file:bg-gradient-to-r file:from-orange-400 file:to-orange-700 hover:file:cursor-pointer hover:file:opacity-80"
        type="file"
        id="image_1"
        name="image_1"
        accept="image/*"
        onChange={({ target }) => {
          if (target.files) {
            setImage_1(target.files[0]);
          }
        }}
      />

      <label className="form-label mt-5">Second Item's Name</label>
      <input
        ref={name_1Ref}
        className="form-input"
        id="name_1"
        name="name_1"
        type="text"
        minLength={0}
        maxLength={20}
      />
      {name_1Error && <p className="text-red-600">{name_1Error}</p>}

      <button
        type="submit"
        className="bg-orange-500 font-medium hover:bg-orange-600 w-1/2 mx-auto rounded-xl p-1 mt-8"
      >
        Save
      </button>
    </form>
  );
};

export default NewVersusForm;
