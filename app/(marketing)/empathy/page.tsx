'use client';

import React from 'react';
import PatientEmpathyMap from './patient-map';
import DeveloperEmpathyMap from './developer-map';
import ProviderEmpathyMap from './provider-map';

const EmpathyPage = () => {
  return (
    <div className="container mx-auto py-8 space-y-12">
      <h1 className="text-4xl font-bold text-center mb-12">Stakeholder Empathy Maps</h1>
      
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">Patient Perspective</h2>
        <PatientEmpathyMap />
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">Healthcare Provider Perspective</h2>
        <ProviderEmpathyMap />
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">Developer Perspective</h2>
        <DeveloperEmpathyMap />
      </section>
    </div>
  );
};

export default EmpathyPage;