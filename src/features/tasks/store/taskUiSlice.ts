import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
export type ViewMode = "board" | "list";
interface State {
  isModalOpen: boolean;
  modalMode: "create" | "edit";
  selectedTaskId: string | null;
  viewMode: ViewMode;
}
const initialState: State = {
  isModalOpen: false,
  modalMode: "create",
  selectedTaskId: null,
  viewMode: "board",
};
const slice = createSlice({
  name: "taskUi",
  initialState,
  reducers: {
    openCreateModal(s) {
      s.isModalOpen = true;
      s.modalMode = "create";
      s.selectedTaskId = null;
    },
    openEditModal(s, a: PayloadAction<string>) {
      s.isModalOpen = true;
      s.modalMode = "edit";
      s.selectedTaskId = a.payload;
    },
    closeModal(s) {
      s.isModalOpen = false;
      s.selectedTaskId = null;
    },
    setViewMode(s, a: PayloadAction<ViewMode>) {
      s.viewMode = a.payload;
    },
  },
});
export const { openCreateModal, openEditModal, closeModal, setViewMode } =
  slice.actions;
export default slice.reducer;
