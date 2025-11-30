// @ts-nocheck
// src/app/admin/_components/ImageUpload.tsx
import { supabase, storage } from '@supabase/supabase-js'

async function uploadProductImage(file: File, productId: string) {
	// 1. Upload to Supabase
	const fileName = `${productId}/${Date.now()}-${file.name}`;
	const { data, error } = await supabase.storage
		.from('products')
		.upload(fileName, file, {
			cacheControl: '3600',
			upsert: false
		});

	// 2. Get public URL
	const { data: { publicUrl } } = supabase.storage
		.from('products')
		.getPublicUrl(fileName);

	// 3. Save to DB via tRPC
	await api.admin.product.addImage.mutate({
		productId,
		storageUrl: publicUrl,
		storagePath: fileName, // for future updates
	});
}