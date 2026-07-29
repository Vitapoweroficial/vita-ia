import type { Metadata } from 'next';
import FlyproProposal from './FlyproProposal';

export const metadata: Metadata = {
  title: 'Proposta Comercial FLYPRO | Vita Power Nutrition',
  description:
    'Proposta comercial interativa para o lançamento do Blend Proteico FLYPRO, desenvolvida pela Vita Power Nutrition.',
};

export default function FlyproProposalPage() {
  return <FlyproProposal />;
}
