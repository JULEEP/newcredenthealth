import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Helmet } from "react-helmet";

import HomePage from "./Pages/Homepage";
import LoginPage from "./Pages/LoginPage";
import CartPage from "./Pages/CartPage";
import DoctorCategoryPage from "./Pages/DoctorCategoryPage";
import DoctorListPage from "./Pages/DoctorListPage";
import MyBookings from "./Pages/MyBookings";
import LabCategoryPage from "./Pages/LabCategoryPage";
import LabTestPage from "./Pages/LabTestPage";
import PackagesPage from "./Pages/PackagesPage";
import ScanAndXRayPage from "./Pages/ScanAndXRayPage";
import PrescriptionPage from "./Pages/PrescriptionPage";
import DiagnosticsPage from "./Pages/DiagnosticsPage";
import WalletPage from "./Pages/WalletPage";
import MedicalRecordsPage from "./Pages/MedicalRecordsPage";
import ChatPage from "./Pages/ChatPage";
import FamilyPage from "./Pages/FamilyPage";
import AddressPage from "./Pages/AddressPage";
import HraPage from "./Pages/HraPage";
import HraQuestionsPage from "./Pages/HraQuestionsPage";
import NotificationsPage from "./Pages/NotificationsPage";
import ProfilePage from "./Pages/ProfilePage";
import DeleteAccountPage from "./Pages/DeleteAccountPage";
import HelpPage from "./Pages/HelpPage";
import DoctorBlogs from './Pages/DoctorBlogs';
import PrivacyAndPolicy from "./Pages/PrivacyAndPolicy";
import TermsandConditions from "./Pages/TermsAndConditions";
import Hraresult from "./Pages/HraResult";
import QuestionPage from "./Pages/QuestionPage";
import MyProfile from "./Pages/MyProfile";

function App() {
  return (
    <Router>
      {/* React Helmet for dynamic head management */}
      <Helmet>
        <title>Credenthealth | Healthcare Solutions & Medical Services</title>
        <meta
          name="description"
          content="Credenthealth - Leading healthcare provider offering medical services, health solutions, patient care and innovative medical technology."
        />
        <meta name="keywords" content="credenthealth, healthcare, medical services, health solutions, patient care, medical technology" />
        <link rel="canonical" href="https://credenthealth.com" />
      </Helmet>

      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/doctor-category/:category/:type" element={<DoctorCategoryPage />} />
        <Route path="/doctor-list/:categoryName" element={<DoctorListPage />} />
        <Route path="/mybookings" element={<MyBookings />} />
        <Route path="/lab-category" element={<LabCategoryPage />} />
        <Route path="/labtest" element={<LabTestPage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/scan&xrays" element={<ScanAndXRayPage />} />
        <Route path="/prescriptions" element={<PrescriptionPage />} />
        <Route path="/diagnostics" element={<DiagnosticsPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/medicalrecord" element={<MedicalRecordsPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/family" element={<FamilyPage />} />
        <Route path="/address" element={<AddressPage />} />
        <Route path="/hra-category" element={<HraPage />} />
        <Route path="/hra-questions" element={<HraQuestionsPage />} />
        <Route path="/notification" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/delete-account" element={<DeleteAccountPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/doctorblogs" element={<DoctorBlogs />} />
        <Route path="/privacyandpolicy" element={<PrivacyAndPolicy />} />
        <Route path="/termsandconditions" element={<TermsandConditions />} />
        <Route path="/hra-result" element={<Hraresult />} />
        <Route path="/questions" element={<QuestionPage />} />
      </Routes>
    </Router>
  );
}

export default App;
