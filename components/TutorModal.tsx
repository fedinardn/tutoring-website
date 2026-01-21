'use client';

import Image from 'next/image';

interface TutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutor: {
    name: string;
    title: string;
    image: string;
    bio: string;
  } | null;
}

export default function TutorModal({ isOpen, onClose, tutor }: TutorModalProps) {
  if (!isOpen || !tutor) return null;

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>&times;</span>
        <Image
          src={tutor.image}
          alt={tutor.name}
          width={200}
          height={200}
          className="modal-image"
        />
        <h2>{tutor.name}</h2>
        <h3>{tutor.title}</h3>
        <p className="modal-bio">{tutor.bio}</p>
      </div>
    </div>
  );
}
