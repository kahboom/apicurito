/**
 * @license
 * Copyright 2018 Red Hat
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Component, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {ApiDefinition, ApiEditorComponent} from "apicurio-design-studio";
import {OtCommand} from "oai-ts-commands";
import {DownloaderService} from "../services/downloader.service";

@Component({
    moduleId: module.id,
    selector: "editor",
    templateUrl: "editor.component.html",
    styleUrls: [ "editor.component.css" ]
})
export class EditorComponent {

    private _api: ApiDefinition;
    private _originalContent: any;
    @Input()
    set api(apiDef: ApiDefinition) {
        this._api = apiDef;
        this._originalContent = apiDef.spec;
    }
    get api(): ApiDefinition {
        return this._api;
    }

    @Output() onClose: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild("apiEditor") apiEditor: ApiEditorComponent;
    dirty: boolean = false;

    constructor(private downloader: DownloaderService) {}

    public onUserSelection(selection: string): void {
        console.log("User selection changed: ", selection);
    }

    public onUserChange(command: OtCommand): void {
        console.log("Something happened! " + JSON.stringify(command));
        this.dirty = true;
    }

    public save(): void {
        let spec: any = this.apiEditor.getValue().spec;
        if (typeof spec === "object") {
            spec = JSON.stringify(spec, null, 4);
        }
        let content: string = spec;
        let ct: string = "application/json";
        let filename = "openapi-spec.json";
        this.downloader.downloadToFS(content, ct, filename);
    }

    public reset(): void {
        let apiDef: ApiDefinition = new ApiDefinition();
        apiDef.createdBy = this.api.createdBy;
        apiDef.createdOn = this.api.createdOn;
        apiDef.tags = this.api.tags;
        apiDef.description = this.api.description;
        apiDef.id = this.api.id;
        apiDef.spec = this._originalContent;
        this.api = apiDef;
        this.dirty = false;
    }

    public generate(): void {
        alert("Generate Project not yet implemented.")
    }

}
