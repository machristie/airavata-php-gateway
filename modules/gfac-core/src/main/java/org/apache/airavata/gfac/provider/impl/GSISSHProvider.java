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
package org.apache.airavata.gfac.provider.impl;

import org.apache.airavata.common.utils.StringUtil;
import org.apache.airavata.commons.gfac.type.ActualParameter;
import org.apache.airavata.commons.gfac.type.MappingFactory;
import org.apache.airavata.gfac.Constants;
import org.apache.airavata.gfac.GFacException;
import org.apache.airavata.gfac.RequestData;
import org.apache.airavata.gfac.context.JobExecutionContext;
import org.apache.airavata.gfac.context.MessageContext;
import org.apache.airavata.gfac.context.security.GSISecurityContext;
import org.apache.airavata.gfac.notification.events.StartExecutionEvent;
import org.apache.airavata.gfac.provider.GFacProvider;
import org.apache.airavata.gfac.provider.GFacProviderException;
import org.apache.airavata.gsi.ssh.api.AuthenticationInfo;
import org.apache.airavata.gsi.ssh.api.Cluster;
import org.apache.airavata.gsi.ssh.api.SSHApiException;
import org.apache.airavata.gsi.ssh.api.ServerInfo;
import org.apache.airavata.gsi.ssh.api.job.JobDescriptor;
import org.apache.airavata.gsi.ssh.impl.DefaultJobSubmissionListener;
import org.apache.airavata.gsi.ssh.impl.MyProxyAuthenticationInfo;
import org.apache.airavata.gsi.ssh.impl.PBSCluster;
import org.apache.airavata.gsi.ssh.listener.JobSubmissionListener;
import org.apache.airavata.schemas.gfac.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

public class GSISSHProvider implements GFacProvider {
    private static final Logger log = LoggerFactory.getLogger(GSISSHProvider.class);

    public void initProperties(Map<String, String> properties) throws GFacProviderException, GFacException {

    }

    public void initialize(JobExecutionContext jobExecutionContext) throws GFacProviderException, GFacException {
        //To change body of implemented methods use File | Settings | File Templates.
    }

    public void execute(JobExecutionContext jobExecutionContext) throws GFacProviderException, GFacException {
        jobExecutionContext.getNotifier().publish(new StartExecutionEvent());
        GsisshHostType host = (GsisshHostType) jobExecutionContext.getApplicationContext().
                getHostDescription().getType();
        HpcApplicationDeploymentType app = (HpcApplicationDeploymentType) jobExecutionContext.getApplicationContext().
                getApplicationDeploymentDescription().getType();
        try {

            GSISecurityContext gssCred = ((GSISecurityContext) jobExecutionContext.
                    getSecurityContext(GSISecurityContext.GSI_SECURITY_CONTEXT));
            RequestData requestData = gssCred.getRequestData();
            ServerInfo serverInfo = new ServerInfo(requestData.getMyProxyUserName(), host.getHostAddress(), 22);
            AuthenticationInfo authenticationInfo
                    = new MyProxyAuthenticationInfo(requestData.getMyProxyUserName(), requestData.getMyProxyPassword(), requestData.getMyProxyServerUrl(),
                    7512, 17280000, System.getProperty(Constants.TRUSTED_CERTIFICATE_SYSTEM_PROPERTY));

            // This installed path is a mandetory field, because this could change based on the computing resource
            Cluster cluster = new PBSCluster(serverInfo, authenticationInfo,host.getInstalledParentPath());
            JobDescriptor jobDescriptor = new JobDescriptor();
            jobDescriptor.setWorkingDirectory(app.getScratchWorkingDirectory());
            jobDescriptor.setShellName("/bin/bash");
            Random random = new Random();
            int i = random.nextInt();
            jobDescriptor.setJobName(app.getApplicationName() + String.valueOf(i));
            jobDescriptor.setExecutablePath(app.getExecutableLocation());
            jobDescriptor.setAllEnvExport(true);
            jobDescriptor.setMailOptions("n");
            jobDescriptor.setStandardOutFile(app.getStandardOutput());
            jobDescriptor.setStandardErrorFile(app.getStandardError());
            jobDescriptor.setNodes(app.getNodeCount());
            jobDescriptor.setProcessesPerNode(app.getProcessorsPerNode());
            jobDescriptor.setMaxWallTime(maxWallTimeCalculator(app.getMaxWallTime()));
            jobDescriptor.setAcountString(app.getProjectAccount().getProjectAccountNumber());
            jobDescriptor.setQueueName(app.getQueue().getQueueName());
            jobDescriptor.setOwner(requestData.getMyProxyUserName());
            List<String> inputValues = new ArrayList<String>();
            MessageContext input = jobExecutionContext.getInMessageContext();
            Map<String, Object> inputs = input.getParameters();
            Set<String> keys = inputs.keySet();
            for (String paramName : keys) {
                ActualParameter actualParameter = (ActualParameter) inputs.get(paramName);
                if ("URIArray".equals(actualParameter.getType().getType().toString()) || "StringArray".equals(actualParameter.getType().getType().toString())
                        || "FileArray".equals(actualParameter.getType().getType().toString())) {
                    String[] values = null;
                    if (actualParameter.getType() instanceof URIArrayType) {
                        values = ((URIArrayType) actualParameter.getType()).getValueArray();
                    } else if (actualParameter.getType() instanceof StringArrayType) {
                        values = ((StringArrayType) actualParameter.getType()).getValueArray();
                    } else if (actualParameter.getType() instanceof FileArrayType) {
                        values = ((FileArrayType) actualParameter.getType()).getValueArray();
                    }
                    String value = StringUtil.createDelimiteredString(values, " ");
                    inputValues.add(value);
                } else {
                    String paramValue = MappingFactory.toString(actualParameter);
                    inputValues.add(paramValue);
                }
            }
            jobDescriptor.setInputValues(inputValues);

            JobSubmissionListener listener = new DefaultJobSubmissionListener();
            cluster.submitAsyncJob(jobDescriptor, listener);
        } catch (SSHApiException e) {
            String error = "Error submitting the job to host " + host.getHostAddress() + e.getMessage();
            log.error(error);
            throw new GFacProviderException(error, e);
        } catch (Exception e) {
            String error = "Error submitting the job to host " + host.getHostAddress() + e.getMessage();
            log.error(error);
            throw new GFacProviderException(error, e);
        }
    }

    public void dispose(JobExecutionContext jobExecutionContext) throws GFacProviderException, GFacException {
        //To change body of implemented methods use File | Settings | File Templates.
    }

    public void cancelJob(String jobId, JobExecutionContext jobExecutionContext) throws GFacException {
        //To change body of implemented methods use File | Settings | File Templates.
    }

    private String maxWallTimeCalculator(int maxWalltime) {
        if (maxWalltime < 60) {
            return "00:" + maxWalltime + ":00";
        } else {
            int minutes = maxWalltime % 60;
            int hours = maxWalltime / 60;
            return hours + ":" + minutes + ":00";
        }
    }
}
