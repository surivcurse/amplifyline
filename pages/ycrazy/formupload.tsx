import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Head from "next/head";
import type { GetServerSideProps, NextPage } from 'next';
import { Slider, Button } from "@material-ui/core";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";
import { generateDownload } from "../utils/cropImage";
//import liff from '@line/liff';


/*export const getServerSideProps = async () => {
	let data = {
		displayName : "",
		userId : ""
	}

	try {
		await liff.init({
			liffId:  process.env.NEXT_PUBLIC_LIFF_ID || "",  // Use own liffId
		});
	
		} catch (error) {
		console.error('liff init error', error.message);
		}
		if (!liff.isLoggedIn()) {
		liff.login();
	}

	await liff.ready.then( async () => {
		await liff.getProfile().then((profile) => {
			data.userId = profile.userId;
			data.displayName = profile.displayName;
		  })
		  .catch((err) => {
			console.log("error", err);
		  });;
	})
  
	return {
	  props: {
		data,
	  },
	}
  }*/
  let data = {
	displayName : "",
	userId : ""
}
  const liffId = process.env.NEXT_PUBLIC_LIFF_ID || "";
const FormUploadPage  = () => {

	useEffect(() => {
	

		async function liffLogin() {
			const liff = (await import('@line/liff')).default;


			liff.ready.then( async () => {
				await liff.getProfile().then((profile) => {
					data.userId = profile.userId;
					data.displayName = profile.displayName;
				  })
				  .catch((err) => {
					console.log("error", err);
				  });;
			})


			try {
			  await liff.init({ liffId });
			} catch (err) {
			  console.error('liff init error', err.message);
			}
			if (!liff.isLoggedIn()) {
			  //liff.login();
			}


		  }
		  liffLogin();
	},[])
	

  const inputRef = useRef<HTMLInputElement | undefined>() as React.MutableRefObject<HTMLInputElement>;;

	const triggerFileSelectPopup = () =>  {

    if (null !== inputRef.current) {
       inputRef.current?.click()
    }

  }

	const [image, setImage] = useState<string>();
	const [croppedArea, setCroppedArea] = useState<Area|null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);


  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      console.log(croppedArea, croppedAreaPixels);
      setCroppedArea(croppedAreaPixels);
    },
    []
  );


	const onSelectFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			const reader = new FileReader();
			reader.readAsDataURL(event.target.files[0]);
			reader.addEventListener("load", () => {
        if(reader.result){
          setImage(reader.result.toString());
        }
			});
		}
	};

	const onDownload = () => {
		generateDownload(image, croppedArea);
	};

	return (
		<div className='container'>
			<div className='container-cropper'>
				{image ? (
					<>
						<div className='cropper'>
							<Cropper
								image={image}
								crop={crop}
								zoom={zoom}
								aspect={1}
                cropShape="round"
                showGrid={false}
								onCropChange={setCrop}
								onZoomChange={setZoom}
								onCropComplete={onCropComplete}
							/>
						</div>

						<div className='slider'>
							<Slider
								min={1}
								max={3}
								step={0.1}
								value={zoom}
                aria-labelledby="Zoom"
                onChange={(e, zoom) => setZoom(Number(zoom))}
							/>
						</div>
					</>
				) : null}
			</div>

			<div className='container-buttons'>
				<input
					type='file'
					accept='image/*'
					ref={inputRef}
					onChange={onSelectFile}
					style={{ display: "none" }}
				/>
				<Button
					variant='contained'
					color='primary'
					onClick={triggerFileSelectPopup}
					style={{ marginRight: "10px" }}
				>
					Choose
				</Button>
				<Button variant='contained' color='secondary' onClick={onDownload}>
					Download
				</Button>
			</div>
		</div>
	);
};
export default FormUploadPage;


