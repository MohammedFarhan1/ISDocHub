import React, { useState, useEffect } from 'react';

const MemberAvatar = ({ memberName, size = 'md' }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 sm:w-16 sm:h-16 text-sm sm:text-base',
    lg: 'w-16 h-16 sm:w-20 sm:h-20 text-base sm:text-lg',
    xl: 'w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-base sm:text-lg'
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  useEffect(() => {
    const fetchMemberImage = async () => {
      try {
        console.log('Fetching image for:', memberName);
        const response = await fetch(`http://localhost:5000/api/admin/member-image/${memberName}`);
        console.log('Response status:', response.status);
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          console.log('Image URL created:', url);
          setImageUrl(url);
          setImageError(false);
        } else {
          console.log('No image found for:', memberName);
          setImageError(true);
        }
      } catch (error) {
        console.error('Error fetching image:', error);
        setImageError(true);
      }
    };

    if (memberName && memberName !== 'All Documents') {
      fetchMemberImage();
    } else {
      setImageError(true);
    }

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [memberName]);

  if (imageUrl && !imageError) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden shadow-lg border-2 border-white`}>
        <img 
          src={imageUrl} 
          alt={memberName}
          className="w-full h-full object-cover rounded-full"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${getAvatarColor(memberName)} rounded-full flex items-center justify-center text-white font-semibold shadow-lg`}>
      {getInitials(memberName)}
    </div>
  );
};

export default MemberAvatar;