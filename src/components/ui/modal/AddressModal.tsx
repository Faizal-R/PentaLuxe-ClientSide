import React from "react";
import Modal from "react-modal";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputsArray: {
    label: string;
    type: string;
  }[];
  formState: Record<string, string>;
  onInputHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addressType: string;
  setAddressType: (value: string) => void;
  onAddressHandler: (
    e: React.MouseEvent<HTMLButtonElement>,
    mode: "Add" | "Edit",
  ) => void;
  isEditMode: boolean;
  addressBtnToggle: boolean;
}

const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  inputsArray,
  formState,
  onInputHandler,
  addressType,
  setAddressType,
  onAddressHandler,
  isEditMode,
  addressBtnToggle,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      className="bg-white w-[95%] sm:w-[80%] md:w-[60%] lg:w-[40%] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-7 outline-none"
    >
      <h2 className="text-2xl font-semibold text-center text-black mb-6">
        {isEditMode ? "Edit Address" : "Add New Address"}
      </h2>

      <form className="flex flex-col gap-6">
        {/* INPUT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {inputsArray.map((input) => (
            <div key={input.label} className="flex flex-col">
              <label className="text-sm text-gray-600 mb-2">
                {input.label}
              </label>
              <input
                type={input.type}
                value={formState[input.label]}
                onChange={onInputHandler}
                name={input.label}
                className="px-4 py-3 border border-gray-300 rounded-lg
                           bg-white text-black placeholder:text-gray-400
                           focus:ring-2 focus:ring-black focus:border-black
                           transition"
              />
            </div>
          ))}
        </div>

        {/* ADDRESS TYPE */}
        <div>
          <p className="text-sm text-gray-600 mb-3">Address Type</p>

          <div className="flex gap-4">
            {["home", "work", "Other"].map((type) => (
              <label
                key={type}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition
                ${
                  addressType === type
                    ? "border-black bg-black text-white"
                    : "border-gray-300 text-gray-600 hover:border-black"
                }`}
              >
                <input
                  type="radio"
                  value={type}
                  name="addressType"
                  checked={addressType === type}
                  onChange={(e) => setAddressType(e.target.value)}
                  className="hidden"
                />
                <span className="capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={addressBtnToggle}
            onClick={(e) => onAddressHandler(e, isEditMode ? "Edit" : "Add")}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-300
              ${
                addressBtnToggle
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800 active:scale-[0.97] shadow-md"
              }`}
          >
            {isEditMode ? "Save Changes" : "Create Address"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddressModal;
