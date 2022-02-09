import { useState, useRef } from "react";

import SiteNavbar from "../components/built/site_navbar";
import { Navbar, NavGroup } from "../components/navbar";
import Modal from "../components/modal";
import Select from "../components/select";
import Button from "../components/button";
import ProgressBar from "../components/progress_bar";

import styles from "../styles/downloads.module.css";

export default function Downloads({ tree }) {
    const [fileTree, setFileTree] = useState(tree);
    const [treePath, setTreePath] = useState([]);
    const [visibleTree, setVisibleTree] = useState(getDescendantProp(tree, treePath));
    const [searchOptions, setSearchOptions] = useState(getSearchOptions(tree));

    const [copyToClipboardAlert, setCopyToClipboardAlert] = useState("");

    const [folderModal, setFolderModal] = useState(false);
    const [fileModal, setFileModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState({});
    const [uploadProgress, updateUploadProgress] = useState(0);
    const folderNameRef = useRef("");

    function CreateFileTree(tree) {
        setVisibleTree(getDescendantProp(tree, treePath));
        setSearchOptions(tree);
        setFileTree(tree);
    }

    function NewFolder(e) {
        e.preventDefault();

        axios.post("/api/repo/folder/create", { path: treePath, folderName: folderNameRef.current.value })
            .then(_ => {
                axios.get("/api/repo/tree")
                    .then(res => {
                        CreateFileTree(res.data);
                    });

                setFolderModal(false);
            })
            .catch(err => console.log(err))
    }
    
    async function UploadFile(e) {
        e.preventDefault();

        const formData = new FormData();
        for (let i = 0; i < selectedFile.length; i++) {
            formData.append("file" + i, selectedFile[i]);
        }
        formData.append("path", treePath)

        await axios.post("/api/repo/upload", formData, {
            headers: { 'content-type': 'multipart/form-data' },
            onUploadProgress: (ev) => {
                const progress = ev.loaded / ev.total * 100;
                updateUploadProgress(Math.round(progress));
            }
        }).catch(err => {});

        axios.get("/api/repo/tree")
            .then(res => {
                CreateFileTree(res.data);
            })
            .catch(err => console.log(err))

        updateUploadProgress(0);
        setFileModal(false);
    }

    function OnFileChange(e) {
        setSelectedFile(e.target.files)
    }

    function BranchClick(branch) {
        if (branch.type === "dir") {
            treePath.push(branch.name);
            setVisibleTree(branch.content);
        } else {
            window.open(window.location.origin + `/api/repo/download/${branch.id}`);
        }
    }

    function BrowsePath(index) {
        treePath.length = index + 1;
        setVisibleTree(getDescendantProp(fileTree, treePath));
    }

    function LinkToClipboard(fileId) {
        copyToClipboard(window.location.origin + `/api/repo/download/${fileId}`)
    }

    function copyToClipboard(textToCopy) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(textToCopy);
        } else {
            let textArea = document.createElement("textarea");
            textArea.value = textToCopy;

            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            return new Promise((res, rej) => {
                document.execCommand('copy') ? res() : rej();
                textArea.remove();
            });
        }
    }

    function OnSearchChange(item) {
        const newTree = item.description.split("/").splice(1);
        setTreePath(newTree)
        setVisibleTree(getDescendantProp(fileTree, newTree))
    }

    function openFileModal() {
        if (treePath.length) setFileModal(true);
    }
    
    function openFolderModal() {
        if (treePath.length) setFolderModal(true);
    }

    return (
        <div className="page-container">
            <SiteNavbar />
            <SuccessAlert data={copyToClipboardAlert} clearData={setCopyToClipboardAlert} />
            <div className="page-wrapper">
                <Navbar>
                    <NavGroup>
                        <Select
                            options={searchOptions}
                            onChange={OnSearchChange}
                            width="35vw"
                            search
                        />
                    </NavGroup>
                    <NavGroup>
                        <Button onClick={openFolderModal}>New Folder</Button>
                        <Button onClick={openFileModal}>Upload File</Button>

                        <Modal open={folderModal} onClose={setFolderModal}>
                            <form className="modal-form" onSubmit={NewFolder}>
                                <label>Folder Name</label>
                                <input type="text" required minLength={4} ref={folderNameRef} />
                                <Button type="submit">Create Folder</Button>
                            </form>
                        </Modal>
                        <Modal open={fileModal} onClose={setFileModal}>
                            <form className="modal-form" onSubmit={UploadFile}>
                                <input type="file" multiple required onChange={OnFileChange} />
                                <ProgressBar progress={uploadProgress} />
                                <Button type="submit">Upload</Button>
                            </form>
                        </Modal>
                    </NavGroup>
                </Navbar>
                <div>
                    <div>
                        <Button onClick={_ => BrowsePath(-1)}>Downloads</Button>
                        {treePath.map((branch, index) => {
                            return (
                                <Button 
                                    key={index} 
                                    onClick={_ => BrowsePath(index)}
                                >
                                    {branch}
                                </Button>
                            )
                        })}
                    </div>
                    <ul className={styles.mx_downloads_list}>
                        {Object.entries(visibleTree).map(([key, value], index) => {
                            return (
                                <div key={index}>
                                    <li 
                                        onClick={_ => BranchClick(value)}
                                    >
                                        {value.type === "file" && <i className="fas fa-file"></i>}
                                        {value.type === "dir" && <i className="far fa-folder"></i>}
                                        {key.toUpperCase()}
                                    </li>
                                    {
                                        value.type === "file" &&
                                        <Button className="none" onClick={_ => {
                                            LinkToClipboard(value.id);
                                            setCopyToClipboardAlert("Link copied to clipboard!");
                                        }}>
                                            <i className="fas fa-link" />
                                        </Button>
                                    }
                                </div>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </div>
    )
}

function getDescendantProp(obj, array) {
    let target = obj;

    for (const prop of array) {
        target = target[prop].content;
    }

    return target ? target : undefined;
}

function getSearchOptions(tree) {
    let options = [];

    for (const [key, value] of Object.entries(tree)) {
        if (value.type === "dir") {
            options.push({
                value: value.path,
                label: key,
                description: value.path,
                icon: <i className="far fa-folder" />
            })
            options = options.concat(getSearchOptions(value.content))
        } else {
            options.push({
                value: value.path,
                label: key,
                description: value.path,
                icon: <i className="fas fa-file" />
            })
        }
    }

    return options;
}

import { getRepoTree } from "./api/repo/tree";
import axios from "axios";
import { SuccessAlert } from "../components/alert";

export async function getServerSideProps({ params }) {
    const req = await getRepoTree();

    return {
        props: { tree: req }
    }
}