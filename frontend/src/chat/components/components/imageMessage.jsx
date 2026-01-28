function ImageCompenent({ address }) {
  const handleDownload = async () => {
    const res = await fetch(address);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "image.jpg";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="relative group mt-1">
        <img src={address} alt="sent" className="rounded max-w-xs bg-white" />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 rounded">
          <button
            onClick={handleDownload}
            className="p-2 bg-white/50 rounded-full hover:bg-white"
          >
            Download
          </button>
        </div>
      </div>
    </>
  );
}

export default ImageCompenent;
