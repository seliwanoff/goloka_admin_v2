import { create } from "zustand";

interface StoreState {
  id?: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  setId?: (id: string) => void;
}

interface FilterState {
  openFilter: boolean;
  setOpenFilter: (value: boolean) => void;
}

interface AddBeneState {
  show: boolean;
  setShow: (value: boolean) => void;
}
interface AddWithdrawSTat {
  open: boolean;
  setOpen: (value: boolean) => void;
}

interface AddSectionState {
  showSection: boolean;
  sectionId: any;
  sectionName: string;
  setSectionName: (value: any) => void;

  setSectionId: (value: any) => void;
  setShowSection: (value: boolean) => void;
  isSectionAdded: boolean;
  setIsSectionAdded: (value: boolean) => void;
}

interface TransferState {
  openTransfer: boolean;
  setOpenTransfer: (value: boolean) => void;
}

interface OpenOrganizationState {
  openOrganization: boolean;
  setOpenOrganization: (value: boolean) => void;
}

interface OpenContributorState {
  openContributor: boolean;
  setOpenContributor: (value: boolean) => void;
}

interface CampaignGroupState {
  fetchData: boolean;
  show: boolean;
  setShowCreate: (value: boolean) => void;
  setFecthed: (value: boolean) => void;
}
interface ReportState {
  showReport: boolean;
  reportId: string;
  setReportId: (value: string) => void;
  setShowReport: (value: boolean) => void;
}
interface RearrangeQuestion {
  showQuestion: boolean;
  setShowQuestion: (value: boolean) => void;
}

interface EditAquestionState {
  showEditQuestion: boolean;
  setShowQuestionEdit: (value: boolean) => void;
}
interface openSuccessModalState {
  open: boolean;
  setOpen: (value: boolean) => void;
}
interface EditCampaignState {
  show: boolean;
  setShow: (value: boolean) => void;
  title: string;
  id: number;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  setId: (value: number) => void;
  isShowEdit: boolean;
  setIsShowEdit: (value: boolean) => void;
  countryId: string[];
  stateIds: string[];
  lgaIds: string[];
}

interface GoogleMapState {
  show: boolean;
  setShow: (value: boolean) => void;
  coordinates: any;
  setCoordinates: (value: any) => void;
  method: any;
  setMethod: (value: any) => void;
}

interface mediaViewerState {
  shows: boolean;
  setShows: (value: boolean) => void;
  type: any;
  setType: (value: any) => void;
  url: any;
  setUrl: (value: any) => void;
}
interface EditCampaignMainState {
  show: boolean;
  setShow: (value: boolean) => void;
  title: string;
  id: number;
  groupdId: any;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  setId: (value: number) => void;
  setGroupId: (value: number) => void;
  isShowEdit: boolean;
  setIsShowEdit: (value: boolean) => void;
  countryId: any;
  stateIds: any;
  lgaIds: any;
  setCountryIds: (value: string) => void;
  setStateIds: (value: string) => void;
  setLgids: (value: string) => void;
  setpayment_rate_for_response: (value: number) => void;
  setResponseRate: (value: number) => void;
  number_of_responses: any;
  setNumberOfresponse: (value: number) => void;
  payment_rate_for_response: any;
  startDate: any;
  endDate: any;
  setStartDate: (value: any) => void;
  setEndDate: (value: any) => void;
  allow_multiple_responses: boolean;
  setAllowMultipleResponses: (value: boolean) => void;
  type: string;
  image: string;
  setImage: (value: string) => void;
  setType: (value: string) => void;
}
const useShowOverlay = create<StoreState>((set) => ({
  open: false,
  setOpen: (value) => set({ open: value }),
}));

const useShowFilter = create<FilterState>((set) => ({
  openFilter: false,
  setOpenFilter: (value) => set({ openFilter: value }),
}));

const useInvoiceOverlay = create<StoreState>((set) => ({
  setId: (value: string) => set({ id: value }),
  open: false,
  setOpen: (value) => set({ open: value }),
}));

const useWithdrawOverlay = create<StoreState>((set) => ({
  open: false,
  setOpen: (value) => set({ open: value }),
}));

const useOpenSuccessModalOverlay = create<openSuccessModalState>((set) => ({
  open: false,
  setOpen: (value) => set({ open: value }),
}));
const useTransferOverlay = create<TransferState>((set) => ({
  openTransfer: false,
  setOpenTransfer: (value) => set({ openTransfer: value }),
}));

const useCreateOrganizationOverlay = create<OpenOrganizationState>((set) => ({
  openOrganization: false,
  setOpenOrganization: (value) => set({ openOrganization: value }),
}));

const useCreateContributorOverlay = create<OpenContributorState>((set) => ({
  openContributor: false,
  setOpenContributor: (value) => set({ openContributor: value }),
}));

const useAddBeneficiaryOverlay = create<AddBeneState>((set) => ({
  show: false,
  setShow: (value) => set({ show: value }),
}));
const useWithdrawalfundsOverlay = create<AddWithdrawSTat>((set) => ({
  open: false,
  setOpen: (value) => set({ open: value }),
}));

const useAddQuestionSectionOverlay = create<AddSectionState>((set) => ({
  showSection: false,
  sectionId: "",
  sectionName: "",
  setSectionName: (value) => set({ sectionName: value }),
  setSectionId: (value) => set({ sectionId: value }),
  setShowSection: (value) => set({ showSection: value }),
  isSectionAdded: false,
  setIsSectionAdded: (value) => set({ isSectionAdded: value }),
}));
const useAddcampaignGroupOverlay = create<CampaignGroupState>((set) => ({
  show: false,
  fetchData: false,
  setFecthed: (value) => set({ fetchData: value }),
  setShowCreate: (value) => set({ show: value }),
}));

const useShowReport = create<ReportState>((set) => ({
  showReport: false,
  reportId: "",
  setReportId: (value) => set({ reportId: value }),

  setShowReport: (value) => set({ showReport: value }),
}));

const useRearrageQuestion = create<RearrangeQuestion>((set) => ({
  showQuestion: false,

  setShowQuestion: (value) => set({ showQuestion: value }),
}));

const useEditAQuestion = create<EditAquestionState>((set) => ({
  showEditQuestion: false,

  setShowQuestionEdit: (value) => set({ showEditQuestion: value }),
}));

const useEditCampaignOverlay = create<EditCampaignState>((set) => ({
  show: false,
  setShow: (value) => set({ show: value }),
  title: "",
  setTitle: (value) => set({ title: value }),
  description: "",
  id: 0,
  setDescription: (value) => set({ description: value }),
  setId: (value) => set({ id: value }),
  isShowEdit: false,

  setIsShowEdit: (value) => set({ isShowEdit: value }),
  countryId: [],
  stateIds: [],
  lgaIds: [],
}));

const useGoogleMap = create<GoogleMapState>((set) => ({
  show: false,
  setShow: (value) => set({ show: value }),
  method: "",
  setMethod: (value) => set({ method: value }),
  setCoordinates: (value) => set({ coordinates: value }),
  coordinates: [],
}));

const useMediaViewer = create<mediaViewerState>((set) => ({
  shows: false,
  setShows: (value) => set({ shows: value }),
  type: "",
  setType: (value) => set({ type: value }),
  setUrl: (value) => set({ url: value }),
  url: "",
}));
const useEditMainCampaignOverlay = create<EditCampaignMainState>((set) => ({
  show: false,
  setShow: (value) => set({ show: value }),
  title: "",
  setTitle: (value) => set({ title: value }),
  description: "",
  id: 0,
  groupdId: "",
  setDescription: (value) => set({ description: value }),
  setId: (value) => set({ id: value }),
  setGroupId: (value) => set({ groupdId: value }),
  isShowEdit: false,
  setIsShowEdit: (value) => set({ isShowEdit: value }),
  countryId: [],
  stateIds: [],
  lgaIds: [],
  setStateIds: (value) => set({ stateIds: value }),
  setLgids: (value) => set({ lgaIds: value }),
  setCountryIds: (value) => set({ countryId: value }),
  number_of_responses: 0,
  setNumberOfresponse: (value) => set({ number_of_responses: value }),
  setResponseRate: (value) => set({ payment_rate_for_response: value }),
  payment_rate_for_response: 0,
  setpayment_rate_for_response: (value) =>
    set({ payment_rate_for_response: value }),
  startDate: null,
  endDate: null,
  setStartDate: (value) => set({ startDate: value }),
  setEndDate: (value) => set({ endDate: value }),
  allow_multiple_responses: false,
  setAllowMultipleResponses: (value) =>
    set({ allow_multiple_responses: value }),
  type: "",
  setType: (value) => set({ type: value }),
  image: "",
  setImage: (value) => set({ image: value }),
}));
export {
  useShowOverlay,
  useShowFilter,
  useInvoiceOverlay,
  useWithdrawOverlay,
  useAddBeneficiaryOverlay,
  useTransferOverlay,
  useAddcampaignGroupOverlay,
  useEditCampaignOverlay,
  useOpenSuccessModalOverlay,
  useAddQuestionSectionOverlay,
  useCreateOrganizationOverlay,
  useWithdrawalfundsOverlay,
  useEditMainCampaignOverlay,
  useGoogleMap,
  useMediaViewer,
  useRearrageQuestion,
  useEditAQuestion,
  useCreateContributorOverlay,
  useShowReport,
};
