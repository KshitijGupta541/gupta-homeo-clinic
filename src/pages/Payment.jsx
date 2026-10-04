import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Copy,
  Check,
  Upload,
  CreditCard,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const UPI_ID = "9414514199@okbizaxis";
const CONSULTATION_FEE = 300;

export default function Payment() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [preview, setPreview] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const upiLink =
    `upi://pay?pa=${encodeURIComponent(UPI_ID)}` +
    `&pn=${encodeURIComponent("Gupta Homeo Clinic")}` +
    `&am=${CONSULTATION_FEE}` +
    `&cu=INR`;

  const copyUPI = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      return;
    }

    setError("");
    setScreenshot(file);

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!appointmentId) {
      setError("Appointment ID is missing.");
      return;
    }

    if (!transactionId.trim()) {
      setError("Please enter your UPI transaction ID.");
      return;
    }

    if (!screenshot) {
      setError("Please upload your payment screenshot.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("appointmentId", appointmentId);
      formData.append("transactionId", transactionId.trim());
      formData.append("paymentScreenshot", screenshot);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/payments/upload`,
        formData
      );

      setSuccess(true);
    } catch (error) {
      console.error("Payment submission error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to submit payment proof. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center px-6">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10 text-center">

          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
            <Check size={42} className="text-emerald-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mt-6">
            Payment Submitted
          </h1>

          <p className="text-gray-500 mt-4 leading-7">
            Thank you. Your payment proof has been submitted successfully.
            Our clinic team will verify your payment and confirm your
            appointment shortly.
          </p>

          <div className="bg-gray-50 rounded-2xl p-5 mt-6 text-left">

            <div className="flex justify-between">
              <span className="text-gray-500">
                Amount
              </span>

              <span className="font-bold">
                ₹300
              </span>
            </div>

            <div className="flex justify-between mt-3">
              <span className="text-gray-500">
                Transaction ID
              </span>

              <span className="font-semibold break-all ml-4 text-right">
                {transactionId}
              </span>
            </div>

            <div className="flex justify-between mt-3">
              <span className="text-gray-500">
                Status
              </span>

              <span className="text-yellow-600 font-semibold">
                Pending Verification
              </span>
            </div>

          </div>

          <button
            onClick={() => navigate("/")}
            className="mt-8 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-semibold transition"
          >
            Return to Home
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-12 px-6">

      <div className="max-w-5xl mx-auto">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-6 transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="text-center mb-10">

          <p className="text-emerald-600 font-semibold tracking-wide uppercase text-sm">
            Gupta Homeo Clinic
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2">
            Complete Your Payment
          </h1>

          <p className="text-gray-500 mt-3">
            Pay the consultation fee to proceed with your appointment.
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* PAYMENT CARD */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="flex items-center gap-3 mb-6">

              <div className="bg-emerald-100 p-3 rounded-xl">
                <CreditCard
                  className="text-emerald-600"
                  size={24}
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Consultation Fee
                </h2>

                <p className="text-gray-500 text-sm">
                  Secure UPI payment
                </p>
              </div>

            </div>

            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white text-center">

              <p className="text-emerald-100 text-sm">
                Amount Payable
              </p>

              <p className="text-5xl font-bold mt-2">
                ₹300
              </p>

            </div>

            <div className="mt-8 text-center">

              <p className="font-semibold text-gray-800 mb-4">
                Scan this QR code using any UPI app
              </p>

              <div className="inline-flex p-5 bg-white border rounded-2xl shadow-md">

                <QRCodeSVG
                  value={upiLink}
                  size={220}
                  level="H"
                  includeMargin
                />

              </div>

              <p className="text-gray-500 text-sm mt-4">
                Google Pay • PhonePe • Paytm • BHIM • Any UPI App
              </p>

            </div>

            <div className="mt-8">

              <label className="text-sm font-semibold text-gray-700">
                UPI ID
              </label>

              <div className="mt-2 flex items-center gap-2 bg-gray-50 border rounded-xl p-3">

                <span className="flex-1 font-medium text-gray-800 break-all">
                  {UPI_ID}
                </span>

                <button
                  type="button"
                  onClick={copyUPI}
                  className="shrink-0 p-2 rounded-lg bg-white border hover:bg-gray-100 transition"
                  title="Copy UPI ID"
                >
                  {copied ? (
                    <Check
                      size={18}
                      className="text-emerald-600"
                    />
                  ) : (
                    <Copy size={18} />
                  )}
                </button>

              </div>

              {copied && (
                <p className="text-emerald-600 text-sm mt-2">
                  UPI ID copied!
                </p>
              )}

            </div>

            <div className="flex items-start gap-3 bg-blue-50 text-blue-700 rounded-xl p-4 mt-6">

              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0"
              />

              <p className="text-sm leading-6">
                After completing the payment, enter your transaction ID and
                upload the payment screenshot on this page.
              </p>

            </div>

          </div>


          {/* VERIFICATION CARD */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <h2 className="text-2xl font-bold text-gray-800">
              Submit Payment Proof
            </h2>

            <p className="text-gray-500 mt-2 leading-6">
              Once you have completed the ₹300 payment, provide the details
              below for verification.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-6"
            >

              {/* TRANSACTION ID */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  UPI Transaction ID
                </label>

                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) =>
                    setTransactionId(e.target.value)
                  }
                  placeholder="Enter your transaction ID"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                />

                <p className="text-xs text-gray-500 mt-2">
                  You can find this in your UPI payment receipt.
                </p>

              </div>


              {/* SCREENSHOT */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Screenshot
                </label>

                <label className="border-2 border-dashed border-gray-300 hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition">

                  <Upload
                    size={30}
                    className="text-emerald-600 mb-3"
                  />

                  <span className="font-semibold text-gray-700">
                    {screenshot
                      ? screenshot.name
                      : "Upload payment screenshot"}
                  </span>

                  <span className="text-xs text-gray-500 mt-2">
                    PNG, JPG or JPEG • Maximum 5 MB
                  </span>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                </label>

              </div>


              {/* PREVIEW */}

              {preview && (
                <div>

                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Screenshot Preview
                  </p>

                  <div className="border rounded-2xl overflow-hidden bg-gray-50">

                    <img
                      src={preview}
                      alt="Payment screenshot preview"
                      width="800"
                      height="600"
                      loading="lazy"
                      decoding="async"
                      className="w-full max-h-80 object-contain"
                    />

                  </div>

                </div>
              )}


              {/* ERROR */}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
                  {error}
                </div>
              )}


              {/* SUBMIT */}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-semibold transition shadow-lg"
              >
                {submitting
                  ? "Submitting Payment Proof..."
                  : "Submit Payment Proof"}
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}