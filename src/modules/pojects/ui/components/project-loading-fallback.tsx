import Image from "next/image";

const ProjectLoadingFall = () => {
  return (
    <div className="p-4 flex items-center gap-x-2 border-b">
      <Image src={"/logo.svg"} width={17} height={17} alt="quikcode" />
      <span className="text-sm font-medium">Loading projects...</span>
    </div>
  );
};

export default ProjectLoadingFall;
