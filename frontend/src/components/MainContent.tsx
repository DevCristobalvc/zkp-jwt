import Tabs from './Tabs';
import JWTExplanation from './JWTExplanation';
import Architecture from './Architecture';
import Documentation from './Documentation';
import Resources from './Resources';
import Features from './Features';

export default function MainContent() {
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: <Features />
    },
    {
      id: 'jwt',
      label: 'Understanding JWT',
      content: <JWTExplanation />
    },
    {
      id: 'architecture',
      label: 'How It Works',
      content: <Architecture />
    },
    {
      id: 'integration',
      label: 'Integration Guide',
      content: <Documentation />
    },
    {
      id: 'resources',
      label: 'Resources',
      content: <Resources />
    }
  ];

  return (
    <section id="content" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs tabs={tabs} defaultTab="overview" />
      </div>
    </section>
  );
}
