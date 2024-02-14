import { CfnOutput, Stack, aws_route53 as route53, aws_route53_targets as targets, aws_certificatemanager as acm, aws_s3 as s3, RemovalPolicy, aws_cloudfront as cloudfront  } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cdk from 'aws-cdk-lib';
import {Bucket, BucketAccessControl} from "aws-cdk-lib/aws-s3";
import {Distribution, OriginAccessIdentity} from "aws-cdk-lib/aws-cloudfront";
import {BucketDeployment, Source} from "aws-cdk-lib/aws-s3-deployment";
import {S3Origin} from "aws-cdk-lib/aws-cloudfront-origins";

import * as path from 'path';

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, context: any, props?: cdk.StackProps) {
    super(scope, id, props);

    const globalContext = this.node.tryGetContext('global')
    const env = context['env']
     /**
      * ########## Get route53 context ##################
      */
    const route53Context = context['route53']

    const domainZone = route53.HostedZone.fromLookup(this, 'Zone', {
      domainName: `${route53Context.domainName}`
    })
    
    const certificate = acm.Certificate.fromCertificateArn(this, 'Cert', `${route53Context.certificateArn}`);

    /**
    * ############# S3 Bucket ################
    */
      const bucket = new Bucket(this, 'Bucket', {
      bucketName: `${globalContext.prefix}-${env.environment}-webapp-bucket`,
      accessControl: BucketAccessControl.PRIVATE,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    })
  
    /**
     * ############# CloudFont ###############
     */
    const originAccessIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity');
    bucket.grantRead(originAccessIdentity);

    
    const cloudFront = new Distribution(this, 'Distribution', {
      defaultRootObject: 'index.html',
      certificate: certificate,
      domainNames: [`${route53Context.recordName}.${route53Context.domainName}`],
      defaultBehavior: {
        origin: new S3Origin(bucket, {originAccessIdentity}),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
      },
    })

    // Add record to route53
    new route53.ARecord(this, 'SiteAliasRecord', {
      recordName: `${route53Context.recordName}`,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(cloudFront)),
      zone: domainZone
    });
    // Deployment new artifact build dist folder
    new BucketDeployment(this, 'BucketDeployment', {
      destinationBucket: bucket,
      sources: [Source.asset(path.resolve(__dirname, '../../dist'))],
      
    })
  }
}

