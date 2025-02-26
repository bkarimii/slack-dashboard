import { UploadOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { Button, message, Upload, Card, Typography, Divider } from "antd";
import { useState } from "react";

const { Title, Text } = Typography;

export const FileUploading = () => {
	const [fileList, setFileList] = useState([]);
	const [uploading, setUploading] = useState(false);

	const handleUpload = () => {
		const formData = new FormData();
		fileList.forEach((file) => {
			formData.append("file", file);
		});
		setUploading(true);

		fetch("https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload", {
			method: "POST",
			body: formData,
		})
			.then((res) => res.json())
			.then(() => {
				setFileList([]); // Clear the file list after successful upload
				message.success("Upload successful.");
			})
			.catch(() => {
				message.error("Upload failed.");
			})
			.finally(() => {
				setUploading(false);
			});
	};

	const props = {
		onRemove: (file) => {
			setFileList((prevList) =>
				prevList.filter((item) => item.uid !== file.uid),
			);
		},
		beforeUpload: (file) => {
			if (file.type !== "application/zip" && !file.name.endsWith(".zip")) {
				message.error("Only .zip files are allowed!");
				return false;
			}
			setFileList((prevList) => [...prevList, file]);
			return false; // Prevent automatic upload
		},
		fileList,
		accept: ".zip",
	};

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
				backgroundColor: "#f4f6f8",
			}}
		>
			<Card
				style={{
					width: 500,
					textAlign: "center",
					padding: "24px",
					borderRadius: "10px",
					boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
				}}
			>
				<CloudUploadOutlined style={{ fontSize: "50px", color: "#1890ff" }} />
				<Title level={3} style={{ marginTop: 16 }}>
					Upload a ZIP File
				</Title>
				<Text type="secondary">Only .zip files are allowed (Max: 1 file)</Text>

				<Divider />

				<Upload
					{...props}
					showUploadList={{ showRemoveIcon: true }}
					style={{ width: "100%" }}
				>
					<Button
						icon={<UploadOutlined />}
						style={{ width: "100%", marginBottom: 12 }}
					>
						Select File
					</Button>
				</Upload>

				<Button
					type="primary"
					onClick={handleUpload}
					disabled={fileList.length === 0}
					loading={uploading}
					style={{ width: "100%", marginTop: 12 }}
				>
					{uploading ? "Uploading..." : "Start Upload"}
				</Button>
			</Card>
		</div>
	);
};
