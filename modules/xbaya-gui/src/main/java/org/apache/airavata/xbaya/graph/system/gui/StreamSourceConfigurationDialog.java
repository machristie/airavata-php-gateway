/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

package org.apache.airavata.xbaya.graph.system.gui;

import java.awt.event.ActionEvent;

import javax.swing.AbstractAction;
import javax.swing.JButton;
import javax.swing.JPanel;

import org.apache.airavata.workflow.model.graph.system.StreamSourceNode;
import org.apache.airavata.xbaya.XBayaEngine;
import org.apache.airavata.xbaya.gui.GridPanel;
import org.apache.airavata.xbaya.gui.XBayaDialog;
import org.apache.airavata.xbaya.gui.XBayaLabel;
import org.apache.airavata.xbaya.gui.XBayaTextField;

public class StreamSourceConfigurationDialog {

    private XBayaEngine engine;

    private StreamSourceNode node;

    private XBayaDialog dialog;

    private GridPanel gridPanel;

    private XBayaLabel wsdlLabel;

    private XBayaTextField wsdlTextField;

    private XBayaLabel descriptionLabel;

    private XBayaTextField descriptionTextField;

    /**
     * Constructs an InputConfigurationWindow.
     * 
     * @param node
     * @param engine
     */
    public StreamSourceConfigurationDialog(StreamSourceNode node, XBayaEngine engine) {
        this.engine = engine;
        this.node = node;
        initGui();
    }

    /**
     * Shows the dialog.
     */
    public void show() {

        this.dialog.show();
    }

    /**
     * Hides the dialog.
     */
    private void hide() {
        this.dialog.hide();
    }

    private void setInput() {
        this.node.setStreamSourceURL(this.wsdlTextField.getText());
        this.node.setConfigured(true);
        this.node.setDescription(this.descriptionTextField.getText());
        hide();
        this.engine.getGUI().getGraphCanvas().repaint();
    }

    /**
     * Initializes the GUI.
     */
    private void initGui() {
        this.wsdlTextField = new XBayaTextField();
        this.wsdlLabel = new XBayaLabel("The EPR of the Stream Source", this.wsdlTextField);

        this.descriptionTextField = new XBayaTextField();
        this.descriptionLabel = new XBayaLabel("Description", this.descriptionTextField);

        this.gridPanel = new GridPanel();
        this.gridPanel.add(wsdlLabel);
        this.gridPanel.add(this.wsdlTextField);
        this.gridPanel.add(descriptionLabel);
        this.gridPanel.add(this.descriptionTextField);
        this.gridPanel.layout(2, 2, 1, 1);

        JButton okButton = new JButton("OK");
        okButton.addActionListener(new AbstractAction() {
            public void actionPerformed(ActionEvent e) {
                setInput();
            }
        });

        JButton cancelButton = new JButton("Cancel");
        cancelButton.addActionListener(new AbstractAction() {
            public void actionPerformed(ActionEvent e) {
                hide();
            }
        });

        JPanel buttonPanel = new JPanel();
        buttonPanel.add(okButton);
        buttonPanel.add(cancelButton);

        this.dialog = new XBayaDialog(this.engine, "Configure Streaming Data source", this.gridPanel, buttonPanel);
        this.dialog.setDefaultButton(okButton);
    }

}