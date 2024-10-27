interface XoCellProps {
  value: "X" | "O" | null;
  onClick: () => void;
}

const XoCell: React.FC<XoCellProps> = ({ value, onClick }) => {
  return (
    <div
      className=" size-24 flex  justify-center items-center  bg-greed-200 cursor-pointer border-green-200 border-8"
      onClick={onClick}
    >
      <span className="text-xl font-bold">{value}</span>
    </div>
  );
};

export default XoCell;
