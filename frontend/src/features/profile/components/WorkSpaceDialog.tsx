import { useWorkSpace } from "../../workspace/useWorkSpace";

export function WorkSpaceDialog() {

  const { closeView } = useWorkSpace();
  return (
    <div>
      <button onClick={() => closeView()} type="button" className="modal-close-button">
        x
      </button>
      <p>This is a working space dialog meant to overlay profile settings</p>
    </div>
  );
}
