import { formatNumber } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-awstoken',
  templateUrl: './awstoken.component.html',
  styleUrls: ['./awstoken.component.scss']
})
export class AwstokenComponent {
  converter!: FormGroup;
  ngOnInit(): void {
    this.converter = new FormGroup({
      normal: new FormControl(null),
      converted: new FormControl(null)
    })

  }
  onConvert() {
    if (this.converter.get('normal')?.value) {
      // Split the text into lines
      const lines = this.converter.get('normal')?.value.split('\n');

      // Initialize an object to store AWS credentials
      const awsCredentials: { [key: string]: string } = {};

      // Use a regular expression to match sessionToken
      const sessionTokenRegex = /aws_session_token=([\s\S]*?)(?=$|[\r\n])/;

      // Loop through the lines and extract AWS credentials dynamically
      for (const line of lines) {
        const keyValue = line.split('=');
        if (keyValue.length >= 2) {
          const key = keyValue[0].trim();
          const value = keyValue.slice(1).join('=').trim(); // Join remaining parts with equal signs

          awsCredentials[key] = value;

          // Check if the sessionToken matches the regular expression
          const sessionTokenMatch = line.match(sessionTokenRegex);
          if (sessionTokenMatch) {
            awsCredentials['sessionToken'] = sessionTokenMatch[1].trim();
          }
        }
      }

      // Check if the required credentials are defined
      if (
        awsCredentials['aws_access_key_id'] &&
        awsCredentials['aws_secret_access_key'] &&
        awsCredentials['sessionToken']
      ) {
        const renamedCredentials: any = {
          accessKeyId: awsCredentials['aws_access_key_id'],
          secretAccessKey: awsCredentials['aws_secret_access_key'],
          sessionToken: awsCredentials['sessionToken']
        };
        const convertedCredentials = Object.keys(renamedCredentials)
          .map(key => `${key}: '${renamedCredentials[key]}'`)
          .join(',\n');
        this.converter.patchValue({ converted: convertedCredentials });
      } else {
        this.converter.patchValue({ converted: 'Required AWS credentials are missing or invalid' });
      }
    }
  }
}