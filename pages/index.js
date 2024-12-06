import Layout from "../components/Layout";
import { useRouter } from 'next/router';
export default function Home() {
  const router = useRouter();
  const handleGetStarted = () => {
    // 'ctrmeet' 페이지로 이동
    router.push('/crtmeet');
  };

  return <Layout>Meflow
     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* "MeFlow" 문구 중앙 배치 */}
      <h1 className="text-4xl font-bold text-blue-600 mb-6">세상의 모든 회의가 올바르고 빠르길</h1>
      <h1 className="text-7xl font-bold bg-blue text-blue-600 p-2 mb-6">MeFlow</h1>
      
      {/* Get Started 버튼 */}
      <button
        onClick={handleGetStarted}
        className="px-6 py-3 text-lg bg-primary font-semibold text-light border-2 border-blue-600 rounded-lg hover:text-blue transition duration-500"
      >
        Get Started
      </button>
    </div>
  </Layout>;
}
