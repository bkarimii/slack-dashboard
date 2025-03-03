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
				setFileList([]);
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
				message.error("You can only upload ZIP files.");
				return false;
			}
			setFileList((prevList) => [...prevList, file]);
			return true; // Allow the file to be added to the list
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
				padding: "16px",
				backgroundColor: "#f4f6f8",
			}}
		>
			<Card
				style={{
					width: "100%",
					maxWidth: 500, // ✅ Responsive fix: works on mobile & desktop
					textAlign: "center",
					padding: "24px",
					borderRadius: "10px",
					boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
				}}
			>
				<CloudUploadOutlined style={{ fontSize: "50px", color: "#1890ff" }} />

				{/* 🔽 Updated Title + Instructions 🔽 */}
				<Title level={3} style={{ marginTop: 16 }}>
					Upload Your Slack Export ZIP File
				</Title>
				<Text type="secondary">
					This page allows you to upload a ZIP file containing your exported
					Slack data. If you haven&apos;t exported your Slack workspace data
					yet, follow the steps below.
				</Text>
				<Divider />

				<Title level={5}>How to Export Your Slack Data:</Title>
				<ul style={{ textAlign: "left", paddingLeft: 24 }}>
					<li>Go to your Slack workspace settings.</li>
					<li>
						Navigate to{" "}
						<strong>Settings & Administration → Workspace settings</strong>.
					</li>
					<li>
						Find the <strong>Import/Export Data</strong> section.
					</li>
					<li>Request an export and download the resulting ZIP file.</li>
				</ul>

				<Text type="secondary">
					For detailed instructions, check out{" "}
					<a
						href="https://slack.com/help/articles/201658943-Export-your-workspace-data"
						target="_blank"
						rel="noopener noreferrer"
						style={{ marginLeft: 4 }}
					>
						this Slack help article.
					</a>
				</Text>
				{/* 🔼 End of Updated Instructions 🔼 */}

				<Divider />

				<Upload {...props} showUploadList={{ showRemoveIcon: true }}>
					<Button
						icon={<UploadOutlined />}
						style={{ width: "100%", marginBottom: 12 }}
					>
						Select File
					</Button>
				</Upload>

				{/* 🔽 Updated Button (Now Always Enabled) 🔽 */}
				<Button
					type="primary"
					onClick={() => {
						if (fileList.length === 0) {
							message.error("Please select a ZIP file before uploading.");
							return;
						}
						handleUpload();
					}}
					loading={uploading}
					style={{ width: "100%", marginTop: 12 }}
				>
					{uploading ? "Uploading..." : "Start Upload"}
				</Button>
				{/* 🔼 End of Button Update 🔼 */}
			</Card>
		</div>
	);
};
