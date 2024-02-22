'use client';

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { thumbnailGenerator } from '@/app/helpers/thumbnailGenerator';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { TbPhotoPlus } from 'react-icons/tb';
import { TiDelete } from 'react-icons/ti';
import {
  generateSHA1,
  generateSignature,
} from '@/app/helpers/coludinaryHelpers';

declare global {
  var cloudinary: any;
}

interface ImageUrls {
  public_id: string;
  thumbnail: string;
  url: string;
  original_filename: string;
  asset_id: string;
}

interface ImageUploadsProps {
  onChange: (value: string[]) => void;
  setIsLoading: (value: boolean) => void;
  removeImage: (value: string) => void;
  value: ImageUrls[];
  fileLimit: number;
  isLoading: boolean;
}
const ImageUploads: React.FC<ImageUploadsProps> = ({
  onChange,
  setIsLoading,
  removeImage,
  value,
  fileLimit = 1,
  isLoading,
}) => {
  const [error, setError] = useState('');
  const [deletingImage, setDeletingImage] = useState('');

  useEffect(() => {
    return () => {
      setError('');
    };
  }, []);

  const hanleUpload = useCallback(
    async (e: any) => {
      setError('');
      const files = [...e.target.files];

      if (files.length > fileLimit) {
        setError(`You can only upload upto ${fileLimit} images`);
        return;
      } else if (files.length === 0) {
        setError(`Upload atleast 1 image`);
        return;
      }

      const data = new FormData();
      data.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);
      data.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!);
      data.append('folder', 'listing_images');

      const promises: any = [];
      setIsLoading(true);
      for (let i = 0; i < files.length; i++) {
        data.append('file', e.target.files[i]);

        let promise;
        promise = new Promise((resolve: any, reject: any) => {
          axios
            .post(process.env.NEXT_PUBLIC_CLOUDINRY_URL! + '/upload', data)
            .then((res) => {
              resolve({
                url: res.data.url,
                original_filename: res.data.original_filename,
                asset_id: res.data.asset_id,
                public_id: res.data.public_id,
              });
            })
            .catch((e) => {
              reject(e.message);
            });
        });
        promises.push(promise);
      }

      Promise.all(promises)
        .then((res: any) => {
          res.forEach((url: any, i: number) => {
            res[i] = {
              ...url,
              thumbnail: thumbnailGenerator(url.url),
            };
          });
          onChange(res);
          toast.success('Images successfully uploaded!');
        })
        .catch((e: any) => {
          toast.error('Something went wrong while uploading images');
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [onChange]
  );

  const handleImageDelete = async (src: any) => {
    const { public_id, asset_id } = src;

    try {
      setDeletingImage(asset_id);
      const timestamp: any = new Date().getTime();
      const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!;
      const signature = generateSHA1(generateSignature(public_id, apiSecret));
      const url = `${process.env.NEXT_PUBLIC_CLOUDINRY_URL}/destroy`;

      const data = new FormData();
      data.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!);
      data.append('folder', 'listing_images');
      data.append('public_id', public_id);
      data.append('signature', signature);
      data.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
      data.append('timestamp', timestamp);
      await axios.post(url, data);
      removeImage(asset_id);
      setDeletingImage('');
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong while deleting image');
    }
  };

  return (
    <div
      className={`h-fit relative rounded-lg overflow-hidden ${
        !value[0]?.url && 'hover:opacity-70 '
      } transition border-2 p-2 border-neutral-300 flex flex-col justify-center items-center text-neutral-600`}
    >
      {value[0]?.url ? (
        <div className='flex items-start justify-start w-full flex-wrap h-fit gap-4'>
          {value.map((src: ImageUrls) => {
            return (
              <div
                key={src.asset_id}
                className={`p-2 relative rounded-md border-2 border-transparent hover:border-gray-200 ${
                  deletingImage === src.asset_id && 'opacity-50'
                }`}
              >
                <div
                  onClick={() => handleImageDelete(src)}
                  className='absolute rounded-md right-0 top-0 cursor-pointer m-1 opacity-50 hover:opacity-90'
                >
                  <TiDelete size={30} color='white' />
                </div>
                <Image
                  alt={src.original_filename}
                  width={190}
                  height={140}
                  src={src.thumbnail}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className='p-20 flex flex-col justify-center items-center gap-4 cursor-pointer'>
          {isLoading ? (
            <div className='flex align-baseline gap-2'>
              Uploading images.. Please wait{' '}
              <span className='animate-spin p-1'>
                <AiOutlineLoading3Quarters />
              </span>
            </div>
          ) : (
            <>
              <input
                className='absolute inset-0 -top-10 cursor-pointer'
                id='fileupload'
                type='file'
                accept='image/png, image/jpg, image/jpeg'
                multiple={fileLimit > 1}
                onChange={hanleUpload}
              />
              <TbPhotoPlus size={50} />
              <div className='text-center'>
                <label className='font-semibold text-lg block'>
                  Click to upload images
                </label>
                <label className='text-sm font-light text-neutral-500 block'>
                  Upload upto {fileLimit} images. Only supports .jpeg, .jpg,
                  .png
                </label>
                <div className='text-sm font-light text-red-500 block'>
                  {error}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploads;
